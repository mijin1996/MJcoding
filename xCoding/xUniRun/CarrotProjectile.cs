using UnityEngine;

[RequireComponent(typeof(Rigidbody2D))]
public class CarrotProjectile : MonoBehaviour {
    [Header("당근 이동")]
    [SerializeField] private float speed = 12f;
    [SerializeField] private float lifeTime = 5f;

    [Header("충돌 이펙트")]
    [SerializeField] private GameObject hitEffectPrefab;
    [SerializeField] private float hitEffectLifeTime = 0.5f;

    private Rigidbody2D carrotRigidbody;
    private Transform target;
    private bool hasHit;

    private void Awake() {
        carrotRigidbody = GetComponent<Rigidbody2D>();
        Destroy(gameObject, lifeTime);
    }

    public void SetTarget(Transform newTarget) {
        target = newTarget;
        Vector2 direction;

        if (target != null) {
            direction = ((Vector2)target.position - carrotRigidbody.position).normalized;
        } else {
            direction = Vector2.right;
        }

        carrotRigidbody.linearVelocity = direction * speed;
    }

    private void OnTriggerEnter2D(Collider2D other) {
        SnailPatrol snail = other.GetComponent<SnailPatrol>();
        if (snail == null) {
            return;
        }
        snail.Die();
        if (hitEffectPrefab != null) {
            GameObject effect = Instantiate(hitEffectPrefab, transform.position, Quaternion.identity);
            Destroy(effect, hitEffectLifeTime); // 당근 충돌 > 이팩트 > 1초대기 > 이펙트 제거
        }
        Destroy(gameObject);
    }
}
